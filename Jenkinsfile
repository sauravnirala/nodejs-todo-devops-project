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

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

cat Dockerfile

docker build -t nodejs-multistage-app .
'''
    }
}


        stage('Run Container') {
            steps {
                sh '''
                   docker rm -f nodejscont || true
                   docker run -d -p 8085:80 --name nodejscont nodejs-multistage-app
                   '''
            }
        }

    }
}
