export const getGithubTokens = () => {
  return process.env.GITHUB_TOKENS?.split?.(",") ?? [];
};

export const getGithubToken = (): string | undefined => {
  const tokens = getGithubTokens();
  if (tokens.length === 0) return undefined;
  if(tokens.length === 1) return tokens[0];
  return tokens[Math.floor(Math.random() * tokens.length)];
};
