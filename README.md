# 初期のセットアップ
$ npm i
$ npm run dev

- .env.local.templateをコピーして.envを作成する。

## Clerkのセットアップ

- [Clerk quickstart](https://clerk.com/docs/quickstarts/nextjs)を参照。
``` .env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={clerkのダッシュボードで取得}
CLERK_SECRET_KEY={clerkのダッシュボードで取得}
```
- middleware.tsをrootに作成する（[Clerkドキュメント](https://clerk.com/docs/quickstarts/nextjs)を参照）
- publicRoutesに以下を追加しておく
```
export default authMiddleware({
  publicRoutes: [
    "/test",
    "/api/uploadthing"
  ],
});
 
```

## PlanetScaleのセットアップ
- [PlanetScaleのドキュメント](https://planetscale.com/docs)を参照

``` .env
...
DATABASE_URL={planetscaleのダッシュボードで取得}
```

# uploadthingの使い方
- アカウント登録を行い、アプリを作成して環境変数をセットする
- [公式ドキュメント](https://docs.uploadthing.com/getting-started/appdir#setting-up-your-environment)を参照

# Stripeの開発環境におけるセットアップ
- Stripe CLIをインストール
	- [Stripe CLIのインストール](https://stripe.com/docs/stripe-cli)
- Stripe CLIで実行してログインする
  - `stripe login`
- webhookにイベントを転送
  - `stripe listen --forward-to localhost:3000/webhook`
* Prodで公開する場合はダッシュボードからエンドポイントを作成する


# Prismaの使い方

## テーブルの作成
- 初めての場合
$ npx prisma generate
$ npx prisma db push

## マイグレーション
$ npx prisma migrate dev

- カラムを追加する場合
$ npx prisma migrate dev --name {migration name}


## テーブルやレコードをGUIで確認する
$ npx prisma studio

## シーディング
$ npx prisma db seed　{seed file path}
