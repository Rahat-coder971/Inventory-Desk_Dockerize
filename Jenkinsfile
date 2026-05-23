pipeline {

    agent any

    environment {

        FRONTEND_IMAGE = "rahathusain22/frontend:latest"
        BACKEND_IMAGE  = "rahathusain22/backend:latest"
        ASG_Name = "asg-for-server"
    }

    stages {

        stage('Clone Repository') {

            steps {

                git 'https://github.com/Rahat-coder971/Inventory-Desk_Dockerize'
            }
        }

        stage('Build Frontend Image') {

            steps {

                sh 'sudo docker build -t $FRONTEND_IMAGE ./client'
            }
        }

        stage('Build Backend Image') {

            steps {

                sh 'sudo docker build -t $BACKEND_IMAGE ./server'
            }
        }

        stage('DockerHub Login') {

            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'credential',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    sh '''
                    echo $DOCKER_PASS | sudo docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Push Frontend Image') {

            steps {

                sh 'sudo docker push $FRONTEND_IMAGE'
            }
        }

        stage('Push Backend Image') {

            steps {

                sh 'sudo docker push $BACKEND_IMAGE'
            }
        }

        stage('Rolling Deployment') {

            steps {

                sh '''

                aws autoscaling start-instance-refresh --auto-scaling-group-name $ASG_Name

                '''
            }
        }
    }
}
