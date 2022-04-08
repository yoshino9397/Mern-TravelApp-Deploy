# How to deploy apps for free

Deploying single react applications and full-stack web applications using Heroku and Netlify.

# Deploying Full-Stack Apps

1. Create a Heroku app.
2. Change your Node app port to

```
process.env.PORT || <any port number>
```

3. Move your front-end app inside the Node app.
4. Add these codes inside your main JS file in your Node app.

```
app.use(express.static(path.join(__dirname, "/<front end app folder name>/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/<front end app folder name>/build', 'index.html'));
});
```

5. Add this script to your package.json in the Node app.

```
"heroku-postbuild": "cd client && npm install && npm run build"
```

6. Change your API URL in your React app.

7. Set your environment variables on Heroku

8. Run these codes.

```bash
heroku login
```

```bash
git init
```

```bash
heroku git:remote -a <app-name>
```

```bash
git add .
```

```bash
git commit -am "my first commit"
```

```bash
git push heroku HEAD:master
```
