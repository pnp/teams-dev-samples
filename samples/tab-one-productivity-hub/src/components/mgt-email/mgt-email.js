import * as moment from 'moment'
import './mgt-email.css';

const provider = window.mgt.Providers.globalProvider;
let mgtEmail = document.querySelector('#mgt-email');

mgtEmail.templateContext = {

  getFormattedDate: (date) => {
      return moment(date).calendar(); 
  },

  emailClick: (e, context, root) => {
      popupCenter({url: context.email.webLink, title: context.email.subject, w: 700, h: 500});  
      return false;
  },

  deleteClick: async (e, context, root) => {
      if (provider && provider.state === window.mgt.ProviderState.SignedIn) {
          let graphClient = provider.graph.client;
          await graphClient.api(`/me/messages/${context.email.id}/move`).post({
              "destinationId": "deleteditems"
          });
          mgtEmail.refresh(true);
      }
  }
}
  
var popupCenter = ({url, title, w, h}) => {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

  const width = window.outerWidth ? window.outerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width;
  const height = window.outerHeight ? window.outerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height;

  const systemZoom = width / window.outerWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  const newWindow = window.open(url, title, 
    `
    scrollbars=yes,
    width=${w / systemZoom}, 
    height=${h / systemZoom}, 
    top=${top}, 
    left=${left}
    `
  )

  if (window.focus) newWindow.focus();
}