const express = require('express');
const bodyParser = require('body-parser');
const { Expo } = require('expo-server-sdk');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const expo = new Expo();

app.post('/send-notification', (req, res) => {                   //this function/route should be called after placing order using Notification Token of the shop owner.
  const { to, title, body } = req.body;                          //"to" is Notification Token

  if (!Expo.isExpoPushToken(to)) {
    return res.status(400).send({ error: 'Invalid Expo push token' });
  }

  const message = [
    {
      to,
      title,
      body
    },
  ];

  expo.sendPushNotificationsAsync(message)
    .then((receipts) => {
      console.log('Notification sent:', receipts);
      res.status(200).send({ success: true, receipts });
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
      res.status(500).send({ error: 'Failed to send notification' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
