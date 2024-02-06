import { ContributionGraph, fetchContributedYears, fetchContributionGraph } from "./graphql";

export const fetchContributions = async (username: string, contibutionYears: number[]) => {
  let allContributions: Contributions | undefined = undefined;

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = now.toISOString().split('T')[0];

  const manyContributions: Contributions[] = [];
  const yearsToFetch: number[] = [];

  for (const contributionYear of contibutionYears) {
    yearsToFetch.push(contributionYear);
  }
  const fetchContributionGraphRequests = yearsToFetch
    .slice()
    .map((year) => fetchContributionGraph(username, year));

  const fetchContributionGraphRes = await Promise.all(fetchContributionGraphRequests);

  let i = 0;

  for (const graph of fetchContributionGraphRes) {
    if (!graph) {
      continue;
    }

    const contributionYear = yearsToFetch[i];
    const contributions = parseContributionGraph(graph);

    contributions && manyContributions.push(contributions);
    i++;
  }

  for (const contributions of manyContributions) {
    let hasAlreadyCommitted = false;
    let lastCommitDate: string | undefined = undefined;
    for (const contributionDate in contributions) {
      if (!allContributions) {
        allContributions = {};
      }

      const count = contributions[contributionDate];
      if (!hasAlreadyCommitted) {
        hasAlreadyCommitted =
          (contributionDate == tomorrow || contributionDate == today) && count > 0;
        lastCommitDate = contributionDate;
      }

      // count contributions up until today
      // also count next day if user contributed already
      if (contributionDate <= today || (contributionDate == tomorrow && count > 0)) {
        // add contributions to the array
        allContributions[contributionDate] = count;
      }
    }

    if (hasAlreadyCommitted) {
      const contributionYear = parseInt(lastCommitDate?.split?.('-')?.[0] || '');

    }
  }
  return allContributions;
}

export const retriveStreakStats = async (username: string) => {
  let contributionYears: number[] = [];
  const cachedContributionYears = [];
  const currentYear = new Date().getFullYear();
  contributionYears = (await fetchContributedYears(username)) ?? [];

  contributionYears.sort((a, b) => a - b);

  const contributions = await fetchContributions(username, contributionYears);

  if (contributionYears.length == 0 || !contributions) {
    return {
      totalContributions: 0,
      firstContribution: null,
      longestStreak: {
        start: null,
        end: null,
        days: 0,
      },
      currentStreak: {
        start: null,
        end: null,
        days: 0,
      },
    };
  }
  const stats = extractStreakStats(contributions);
  return stats;
};

export type Contributions = {
  [key: string]: number;
};
export const extractStreakStats = (contributions?: Contributions) => {
  if (!contributions) {
    return undefined;
  }

  const contributionsArr = Object.keys(contributions);
  const todayKey = contributionsArr.at(-1) ?? '';
  const firstKey = contributionsArr[0] ?? '';

  const stats: StreakStats = {
    totalContributions: 0,
    firstContribution: '',
    longestStreak: {
      start: firstKey,
      end: firstKey,
      days: 0,
    },
    currentStreak: {
      start: firstKey,
      end: firstKey,
      days: 0,
    },
  };

  // calculate stats based on contributions
  for (const contributionDate in contributions) {
    const contributionCount = contributions[contributionDate];
    // add contribution count to total
    stats.totalContributions += contributionCount;

    // check if still in streak
    if (contributionCount > 0) {
      // increment streak
      stats.currentStreak.days += 1;
      stats.currentStreak.end = contributionDate;

      // set start on first day of streak
      if (stats.currentStreak.days == 1) {
        stats.currentStreak.start = contributionDate;
      }

      // first date is the first contribution
      if (stats.firstContribution.length <= 0) {
        stats.firstContribution = contributionDate;
      }

      // update longest streak
      if (stats.currentStreak.days > stats.longestStreak.days) {
        // copy current streak start, end, and length into longest streak
        stats.longestStreak.start = stats.currentStreak.start;
        stats.longestStreak.end = stats.currentStreak.end;
        stats.longestStreak.days = stats.currentStreak.days;
      }
    }

    // reset streak with exception for today
    else if (contributionDate != todayKey) {
      // reset streak
      stats.currentStreak.days = 0;
      stats.currentStreak.start = todayKey;
      stats.currentStreak.end = todayKey;
    }
  }
  return stats;
};

const parseContributionGraph = (graph?: ContributionGraph) => {
  if (!graph) return undefined;

  let contributions: Contributions | undefined = undefined;
  for (const week of graph.weeks) {
    for (const contributionDay of week.contributionDays) {
      const date = contributionDay.date;
      const count = contributionDay.contributionCount;
      if (!contributions) {
        contributions = {};
      }
      contributions[date] = count;
    }
  }
  return contributions;
};
export type StreakStats = {
  totalContributions: number;
  firstContribution: string;
  longestStreak: {
    start: string;
    end: string;
    days: number;
  };
  currentStreak: {
    start: string;
    end: string;
    days: number;
  };
};
