# 初期のセットアップ
$ npm i
$ npm run dev

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


