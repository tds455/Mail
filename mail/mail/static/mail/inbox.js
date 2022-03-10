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

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Retrieve mailbox content using GET request
  // Based on sample code in CS50W Mail specification, adjusted to reflect which mailbox the user is trying to access
  // After retrieving, store each e-mail in it's own div (https://www.tutorialspoint.com/how-to-add-a-new-element-to-html-dom-in-javascript) and 50W Mail hints section, using a for loop
  // for looping through an array in JS - forEach https://www.w3schools.com/jsref/jsref_foreach.asp
  // Note - Use `` and not '' when making fetch request
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {
    const element = document.createElement('div');
    // Render the sender, recipients, subject, timestamp and body to user
    element.innerHTML = "<p>testing hello</p>";
    document.querySelector('#emails-view').appendChild(element);
    });

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
