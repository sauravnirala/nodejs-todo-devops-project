pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'sauravnirala/nodejs-todo-devops-project' // Docker Hub repo
    }

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

        stage('DOCKER LOGIN & PUSH') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockercred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker tag nodejs-multistage-app $DOCKER_HUB_REPO:latest
                        docker push $DOCKER_HUB_REPO:latest
                    '''
                }
            }
        }



        stage('Run Container') {
            steps {
                sh '''
                   docker stop nodejscont || true
                   docker rm nodejscont || true
                   docker run -d --name nodejscont -p 8085:3000 $DOCKER_HUB_REPO:latest
                   '''
            }
        }

    }
}
