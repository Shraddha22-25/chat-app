router.post("/send", upload.single("image"), (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  console.log("Sender:", sender_id);
  console.log("Receiver:", receiver_id);
  console.log("Message:", message);
  console.log("Uploaded File:", req.file);

   if (!sender_id || !receiver_id || (!message?.trim() && !req.file)) {
    return res.status(400).json({
      success: false,
      message: "Sender, receiver and message/image are required"
    });
  }

  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO messages
    (sender_id, receiver_id, message, image)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      String(sender_id),
      String(receiver_id),
      message ? message.trim() : "",
      image
    ],
    (err, result) => {
      if (err) {
        console.log("Send Message Error:", err);

        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      console.log("Message Saved:", result.insertId);
      console.log("Image Saved:", image);

      res.status(201).json({
        success: true,
        message: "Message Sent Successfully",
        insertId: result.insertId,
        image: image
      });
    }
  );
});