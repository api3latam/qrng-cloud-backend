FROM amazon/aws-lambda-nodejs:16@sha256:eef6f811663a8888bb32fcd43e3b2dadbcc1a249eed92b50c5d3ddd9c7937326

COPY ../app package.json ${LAMBDA_TASK_ROOT}

RUN npm install

CMD [" app.handler "]
