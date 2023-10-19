import { useEffect } from 'react'
import config from '../utils/config';

export const LoginSignout = () => {
  const gapi = window.gapi;
  const google = window.google;

  const {CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES} = config

  const accessToken = localStorage.getItem('access_token');
  const expiresIn = localStorage.getItem('expires_in');


  let tokenClient;

  useEffect(() => {
    gapiLoaded()
    gisLoaded()
  })

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });

    if (accessToken && expiresIn) {
      gapi.client.setToken({
        access_token: accessToken,
        expires_in: expiresIn,
      });
      listUpcomingEvents();
    }
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '',
    });


  }

  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error) {
        throw (resp);
      }
      await listUpcomingEvents();
      const { access_token, expires_in } = gapi.client.getToken();
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('expires_in', expires_in)
    };

    if (!(accessToken && expiresIn)) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      localStorage.clear();
    }
  }

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        'calendarId': 'primary',
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }

    const events = response.result.items;
    console.log(events)
    if (!events || events.length === 0) {
      document.getElementById('content').innerText = 'No events found.';
      return;
    }
    const output = events.reduce(
      (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,'Events:\n');
      console.log(events)
    document.getElementById('content').innerText = output;
  }
  
  function addManualEvent(){
    var event = {
      'kind': 'calendar#event',
      'summary': 'Event 2',
      'location': 'Masai School, Bangalore',
      'description': 'Paty time',
      'start': {
        'dateTime': '2023-03-18T01:05:00.000Z',
        'timeZone': 'UTC'
      },
      'end': {
        'dateTime': '2023-03-18T01:35:00.000Z',
        'timeZone': 'UTC'
      },
      'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=1'
      ],
      'attendees': [
        {'email': 'techmovieadd@gmail.com','responseStatus':'needsAction'},
      ],
      'reminders': {
        'useDefault': true,
      },
      "guestsCanSeeOtherGuests": true,
    }

      var request = gapi.client.calendar.events.insert({'calendarId': 'primary','resource': event,'sendUpdates': 'all'});
      request.execute((event)=>{
          console.log(event)
          window.open(event.htmlLink)
      },(error)=>{
        console.error(error);
      });
  }
  return (
    <div>
      <button id="authorize_button" hidden={accessToken && expiresIn} onClick={handleAuthClick}>Authorize</button>
      <button id="signout_button" hidden={!accessToken && !expiresIn}   onClick={handleSignoutClick}>Sign Out</button>
      <button id='add_manual_event' hidden={!accessToken && !expiresIn} onClick={addManualEvent}>Add Event</button>
      <pre id="content" style={{ whiteSpace: 'pre-wrap' }}></pre>
    </div>
  )
}

export default LoginSignout