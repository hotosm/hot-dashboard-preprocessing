# Hot Dashboard Preprocessing

## Install

Run `npm install` to install all the needed dependencies.

## How this works

This project is developed from a react basis so it's javascript based. 
Because this script will run from a [Lambda](https://aws.amazon.com/documentation/lambda/) function, 
we have to transform it into a Node.js interpretable code. In order to do so, we use [Babel](https://babeljs.io/docs/en/)

## Build

Run `npm run build:preprocess` to transform the javascript project into a Node.js executable one. 
The build artifacts will be stored in the `dist-preprocess` directory.

## Deploy on AWS Lambda

You need to set up a lambda function but before then, you have to create an IAM role with the "LambdaExecute" role.
For the lambda creation, choose the Node.js 8.10 runtime and the role you just created.

Then, you have to import the dist-preprocess folder you created thanks to babel. Don't forget to compress it !

Once it's done, you have to type in the Handler, it should be `dist-preprocess/scripts/Preprocess.default` for this specific project.

Then, you can create a cron job in order to execute the function on a regular basis.
You can get help [here](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html)

## Dependencies

    - babel-cli
    - babel-plugin-transform-async-functions
    - babyparse
    - jquery

## Further help

To get more help on Babel go check out the [Babel README](https://github.com/babel/babel/blob/master/README.md).

## Known issues

If you have require issues when launching the lambda function, you need to run npm i into the dist-preprocess folder.