# Data-Visualisation-Website
Website with a graphical representation of information and data collected from web services and spreadsheets

### Front end Screenshots

![Screenshot 2024-07-06 174848](https://github.com/user-attachments/assets/4ae2e990-57a4-4d98-98cd-3f1b5e680150)
Figure 1Team Stats page

![Screenshot 2024-07-06 174909](https://github.com/user-attachments/assets/c4697011-3de6-4eaa-bf2a-913bcfb02d48)

Figure 2 Sentiment Page

![Screenshot 2024-07-06 174923](https://github.com/user-attachments/assets/5ff05f48-0801-42db-9dec-d3e8710f7d8d)



Figure 3 Prediction Page


![Screenshot 2024-07-06 175010](https://github.com/user-attachments/assets/4763bf87-e387-499c-879a-71bb34bc77ec)

Figure 4 Results Page



## Features implemented
### Data Storage
Data have been collected from2 different sources. Numerical data collected from spreadsheet and stored in the DynamoDB table with the use of TypeScript. Text Data was collected through a third-party web service and stored in the DynamoDB table.
### Machine Learning for Predictions
AWS SageMaker DeepAR algorithm was used to train a model and then having it deployed on an endpoint, making it accessible for real-time predictions on new data.
### Sentiment Analysis
Once data have been collected and uploaded to the DynamoDB table, the lambda function to process the text data will be triggered, execute the sentiment analysis on the data and save to a different table for a faster retrieval to the user.
### Cloud Services
Services such as API Gateway, Lambda and DynamoDB are largely used to build and deploy the backend. API Gateway offers a secure and scalable interface through which features can be accessed. Lambda functions, that carry out backend logic in response to the DynamoDB trigger or the API requests. DynamoDB, that stores all the essential data.

## Architecture Diagram
 ![Screenshot 2024-07-06 174745](https://github.com/user-attachments/assets/ebb50979-e593-4f56-a0a6-d94345eb77fe)
 
![Screenshot 2024-07-06 174753](https://github.com/user-attachments/assets/ef01ec99-63d4-4684-87c2-edbb6df1b4e8)

![Screenshot 2024-07-06 174802](https://github.com/user-attachments/assets/306b5056-b82f-461d-a02d-3d50e4d51260)

![Screenshot 2024-07-06 174813](https://github.com/user-attachments/assets/0a1f384f-b59e-4023-950c-ef19a2036b77)

![Screenshot 2024-07-06 174737](https://github.com/user-attachments/assets/71046cd9-6fdc-4f9e-8fcf-1ea8b35b8ea5)

