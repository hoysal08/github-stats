import axios from "axios";
import { getGithubToken } from "../utils/helper";
import logger from "../utils/logger";

const url = 'https://api.github.com/graphql';

export const fetchGraphQL = async (query: string) =>{
const githubToken = getGithubToken();
return await axios.post(
    url,{
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

    try{
        const res = await fetchGraphQL(query);
        const contributionYears = res.data?.data?.user?.contributionsCollection?.contributionYears;
        return contributionYears;
    }
    catch(err){
        logger.error('fetchContributionYears', err);
        logger.debug('GitHub username: ', username);
        return undefined;
    }
};
