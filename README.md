# NextJsBlog_Steps

초급 개발자 교육용 Next.js 블로그를 `main` starter에서 시작해 `step-N` 브랜치로 단계별 누적 학습하는 저장소입니다.

## Branch Hierarchy

이 저장소의 브랜치는 독립적인 예제 복사본이 아니라 부모-자식 관계를 가진 학습 이력입니다. 기본 흐름은 `main -> step-1 -> step-2 -> ... -> step-N`이며, 각 `step-N`은 바로 이전 단계 위에 기능과 문서를 누적합니다.

향후 작업 시 이 계층을 기준으로 수정해야 합니다. 특정 단계부터 필요한 변경은 가장 이른 affected step에서 먼저 커밋하고, 그 다음 step으로 순서대로 merge해서 전파합니다. 같은 변경을 여러 step 브랜치에 각각 따로 커밋하면 교육용 브랜치의 ancestry가 깨져 수강생과 강의자가 서로 다른 기준을 보게 됩니다.

브랜치 관계는 아래 명령이 성공하는 상태를 목표로 유지합니다.

```bash
git merge-base --is-ancestor step-N step-(N+1)
```

## create-next-app README

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
