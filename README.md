### Step1
環境構築
```npm i
cd <project>
npm i --prefix client
npm i --prefix server
```

### Step2
.env.sampleに倣って.envを書き換え
```
cd /server
cp .env.example .env
```

### Step3
client下で`npm start`によりhttp://localhost:3000/を立ち上げる

server下で`npm start`によりhttp://localhost:3001/を立ち上げる
