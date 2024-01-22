import { fetchContributedYears } from "./graphql";

export const fetchContributions = async (username: string, contibutionYears:number[]) => {
    let allContributions: Contributions | undefined = undefined;
}
export const retriveStreakStats = async (username: string) => {
  let contributionYears: number[] = [];
  const cachedContributionYears = [];
  const currentYear = new Date().getFullYear();
  contributionYears = (await fetchContributedYears(username)) ?? [];

};

export type Contributions = {
    [key: string]: number;
  };