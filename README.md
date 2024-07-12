# Data-Visualisation-Website
Website with a graphical representation of information and data collected from web services and spreadsheets

### Front end Screenshots

![Screenshot 2024-07-06 174848](https://github.com/user-attachments/assets/4ae2e990-57a4-4d98-98cd-3f1b5e680150)

Figure 1Team Stats page

![Screenshot 2024-07-06 174909](https://github.com/Jo-costa/Data-Visualisation-Website/assets/83645050/59d35f55-7472-4ccc-89b0-79bca9f8f1e7) 

Figure 2 Sentiment Page

![Screenshot 2024-07-06 174923](https://github.com/Jo-costa/Data-Visualisation-Website/assets/83645050/d70547af-88d0-4713-bca6-d47a5b2a93fc)

Figure 3 Prediction Page


![Screenshot 2024-07-06 175010](https://github.com/Jo-costa/Data-Visualisation-Website/assets/83645050/1c646d93-f46f-4f74-9c2f-dd7cef43bd19)

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
 ![Screenshot 2024-07-06 174737](https://github.com/Jo-costa/Data-Visualisation-Website/assets/83645050/afaaa3e0-4ad6-4b18-afbc-76e792c94715)
 
![Screenshot 2024-07-06 174745](https://github.com/Jo-costa/Data-Visualisation-Website/assets/83645050/72b28c67-6f61-4892-af9d-a1c4e58ad65c)

![Screenshot 2024-07-06 174753](https://github.com/Jo-costa/Data-Visualisation-Website/assets/83645050/0db77e26-3774-413c-9e4d-a3775679451c)

![Screenshot 2024-07-06 174802](https://github.com/Jo-costa/Data-Visualisation-Website/assets/83645050/3bb70940-bb98-489d-9939-095731d482a2)

![Screenshot 2024-07-06 174813](https://github.com/Jo-costa/Data-Visualisation-Website/assets/83645050/23a0c7ac-b3fc-4d7b-91c0-378437022937)

