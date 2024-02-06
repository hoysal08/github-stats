import axios from "axios";
import { getGithubToken } from "../utils/helper";
import logger from "../utils/logger";

const url = 'https://api.github.com/graphql';

export const fetchGraphQL = async (query: string) => {
    const githubToken = getGithubToken();
    return await axios.post(
        url, {
        query
    },
        {
            headers: {
                Authorization: `bearer ${githubToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github.v4.idl',
                'User-Agent': 'GitHub-Stats-Api',
            },
        }
    )
}

export const fetchContributedYears = async (
    username: string
): Promise<number[] | undefined> => {
    const query = `query{
        user(login: "${username}"){
            contributionsCollection{
                contributionYears
            }
        }
    }`;

    try {
        const res = await fetchGraphQL(query);
        const contributionYears = res.data?.data?.user?.contributionsCollection?.contributionYears;
        return contributionYears;
    }
    catch (err) {
        logger.error('fetchContributionYears', err);
        logger.debug('GitHub username: ', username);
        return undefined;
    }
};

export const fetchContributionGraph = async (
    username: string,
    year: number,
): Promise<ContributionGraph | undefined> => {
    const startDate = `${year}-01-01T00:00:00Z`;
    const endDate = `${year}-12-31T23:59:59Z`;
    const query = `query {
      user(login: "${username}") {
        contributionsCollection(from: "${startDate}", to: "${endDate}") {
            contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
            }
        }
      }
    }
    `;

    try {
        const res = await fetchGraphQL(query);
        return res.data?.data?.user?.contributionsCollection?.contributionCalendar;
    } catch (e) {
        logger.error('fetchContributionGraph', e);
        logger.debug('GitHub username: ', username);
        return undefined;
    }
};

export type ContributionGraph = {
    totalContributions: number;
    weeks: {
      contributionDays: {
        contributionCount: number;
        date: string;
      }[];
    }[];
  };