pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/sauravnirala/nodejs-todo-devops-project.git'
            }
        }

        stage('Create Dockerfile & Build Image') {
            steps {
                sh '''
                cat <<EOF > Dockerfile
                # Stage 1 : Build
                FROM node:18 AS build
                WORKDIR /app
                COPY . .
                RUN npm install
                RUN npm run build

                # Stage 2 : Runtime
                FROM nginx:alpine
                COPY --from=build /app/build /usr/share/nginx/html
                EXPOSE 80
                CMD ["nginx", "-g", "daemon off;"]
                EOF
                
                cat Dockerfile

                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                   docker build -t nodejs-multistage-app .
                   docker rm -f nodejscont || true
                   docker run -d -p 8085:80 --name nodejscont nodejs-multistage-app
                   '''
            }
        }

    }
}
