import { createConsumer } from "@rails/actioncable";

// set up a websocket consumer
const consumer = createConsumer("/cable");

export default consumer;
