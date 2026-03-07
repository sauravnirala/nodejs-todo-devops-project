pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/sauravnirala/nodejs-todo-devops-project.git'
            }
        }

        stage('Build Docker Image') {
    steps {
        sh '''
cat <<EOF > Dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000
CMD ["node", "app.js"]
EOF

cat Dockerfile

docker build --no-cache -t nodejs-multistage-app .
'''
    }
}


        stage('Run Container') {
            steps {
                sh '''
                   docker stop nodejscont || true
                   docker rm nodejscont || true
                   docker run -d --name nodejscont -p 8085:3000 nodejs-multistage-app
                   '''
            }
        }

    }
}
