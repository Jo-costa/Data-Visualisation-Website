# Data-Visualisation-Website
Website with a graphical representation of information and data collected from web services and spreadsheets

### Front end Screenshots

![Screenshot 2024-07-17 141620](https://github.com/user-attachments/assets/c4bde3ab-36c3-4f24-914d-707341c4372e)

Figure 1 Team Stats page

![Screenshot 2024-07-17 141636](https://github.com/user-attachments/assets/27767d45-9a3a-44d9-a0d6-7419a378a81b)

Figure 2 Sentiment Page

![Screenshot 2024-07-17 141649](https://github.com/user-attachments/assets/44e659f3-f210-451e-9b43-974e4f120f23)


Figure 3 Prediction Page


![Screenshot 2024-07-17 141700](https://github.com/user-attachments/assets/92c6162b-7eec-42ad-bd81-408a61cb419d)

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
![Screenshot 2024-07-17 142047](https://github.com/user-attachments/assets/a42198c7-8ec9-48d3-9b13-b7e1c57b3be4)

![Screenshot 2024-07-17 142055](https://github.com/user-attachments/assets/b213a0a3-9e01-4b3c-ba59-c897f64e0e7e)

![Screenshot 2024-07-17 142103](https://github.com/user-attachments/assets/38fc71b8-cf16-42d2-951e-c5f8d557f70a)

![Screenshot 2024-07-17 142152](https://github.com/user-attachments/assets/361fa4ac-8114-4ade-8540-ae36f034e51f)

![Screenshot 2024-07-17 142203](https://github.com/user-attachments/assets/e9038a96-d427-4f45-a870-ad0d5024b63b)

