document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_mail);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // When a mailbox is visited, the name of the mailbox should appear at the top of the page
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;




  // When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.
  // Based on sample code in CS50W Mail specification, adjusted to reflect which mailbox the user is trying to access
  // After retrieving, store each e-mail in it's own div (https://www.tutorialspoint.com/how-to-add-a-new-element-to-html-dom-in-javascript) and 50W Mail hints section, using a for loop
  // for looping through an array in JS - forEach https://www.w3schools.com/jsref/jsref_foreach.asp
  // Note - Use `` and not '' when making fetch request and writing HTML, but use '' when indexing the objects inside of that code.
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {
    // Each email should then be rendered in its own box (e.g. as a <div> with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.
    const element = document.createElement('div');
    // Show the sender, subject and timestamp of each email
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    element.classList.add("emails");
    // element.classList.add("row");
    element.innerHTML = `<p class="col-sm">Sender: ${email['sender']}</p>  <p class="col-sm">Subject: ${email['subject']}</p> <p class="col-sm">Date and time: ${email['timestamp']}</p>`
    // If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.
    // https://www.codegrepper.com/code-examples/javascript/javascript+add+style+to+div
    if (email['read'] == 0) {
      element.style.backgroundColor = "white";
    }
    else {
      element.style.backgroundColor = "lightgrey";
    }

    // Make e-mail "clickable"
    element.addEventListener('click', event => {open_email(email['id'])});

    // Render the e-mails back to the user
    document.querySelector('#emails-view').appendChild(element);
    });

  });
  }

function open_email(id) {
  // Hide other views
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  //  make a GET request to /emails/<email_id> to request the email.
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {

      // show the email’s sender, recipients, subject, timestamp, and body.
      const element = document.createElement('div');
      element.classList.add("emails");
      element.innerHTML = `<p class="col-sm">Sender: ${email['sender']}</p>  <p class="col-sm">Subject: ${email['recipients']}</p>  <p class="col-sm">Subject: ${email['subject']}</p> <p class="col-sm">Date and time: ${email['timestamp']} <p class="col-sm">Date and time: ${email['body']}</p>`
      document.querySelector('#emails-view').appendChild(element);

      // mark the email as read.
  });
  


}


function send_mail() {
  
  // Retrieve values from form
  // https://www.w3schools.com/jsref/met_document_queryselector.asp
  var recipients = document.querySelector("#compose-recipients").value;
  var subject = document.querySelector("#compose-subject").value;
  var body = document.querySelector("#compose-body").value;

  // Create POST request
  // Based on sample code in CS50W Mail specification
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });

  // If successful, load sent mailbox
  load_mailbox('sent');

}
