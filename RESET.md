# Resetting for another practice session

This repository is intended to be reset with Git. Commit the clean baseline once, then create a disposable branch for each session.

## One-time baseline

```bash
git init                       # only if this directory is not already a repository
git add .
git commit -m "interview sandbox baseline"
```

## Start a session

```bash
git switch -c practice/my-session
npm install
npm run dev
```

## Reset tracked exercise changes

First inspect what will be lost:

```bash
git status --short
git diff
```

If you do not need the work, return to the baseline branch and delete the disposable branch:

```bash
git switch main
git branch -D practice/my-session
git switch -c practice/my-next-session
```

If your baseline branch is named `master`, substitute `master` for `main`. Untracked files are not removed by switching branches; inspect them with `git status` and delete only the specific files you no longer need. Do not delete `.git`, `CHALLENGES.md`, or the baseline commit.
