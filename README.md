# GitHub Stats API

This is a Node.js application built deliver Github Statistics of a given profile.

## Features

- Open Source
- Support CORS
- Fast and efficient due to caching

```json

https://github-stats-production.up.railway.app/stats/[GITHUB_USERNAME_HERE]

Example:

https://github-stats-production.up.railway.app/stats/hoysal08

Returns:

{
    "totalContributions": xxxxx,
    "firstContribution": "xxxx-xx-xx",
    "longestStreak": {
        "start": "xxxx-xx-xx",
        "end": "xxxx-xx-xx",
        "days": xxxx
    },
    "currentStreak": {
        "start": "xxxx-xx-xx",
        "end": "xxxx-xx-xx",
        "days": xxxx
    }
}

```
