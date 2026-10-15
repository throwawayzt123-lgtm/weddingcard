# Mobile testing checklist

Most guests open the invitation on a phone from WhatsApp, and many customers fill in their details from a phone. Test on **at least one Android phone and one iPhone** (or ask a friend), on mobile data, not just Wi-Fi.

Tick each box. If something fails, note the phone model and what you saw.

## A. The invitation (send yourself a personal link on WhatsApp)

**Link and preview**
- [ ] Paste the link in a WhatsApp chat: the preview card shows the couple's names and, for a personal link, “You're invited, …”
- [ ] Tap the link: it opens in the phone browser in a second or two
- [ ] The opening screen fits the whole screen with no side-scrolling (try a small phone, 360 px wide)

**Opening and music**
- [ ] The “Tap to Open” button is easy to tap with a thumb
- [ ] After tapping, the animation plays smoothly (doors / envelope / curtains / arch) and the page appears
- [ ] Music starts after the tap. The round button at bottom-left mutes and unmutes it
- [ ] Phone on silent mode: no crash, the page still works
- [ ] Switch to another app and back: music pauses and resumes

**Content**
- [ ] The greeting reads “Dear Sarah & Family,” (or “Dear Guest,” on the general link)
- [ ] Only the events this guest is invited to are shown
- [ ] The family section shows two columns on a tablet and one column on a phone; phone numbers open the dialler
- [ ] Urdu text (Bismillah) is right-to-left and readable
- [ ] The countdown is ticking
- [ ] **Get Directions** opens Google Maps with the right place
- [ ] **Add to Calendar** works (Google Calendar link, and the .ics file on iPhone)
- [ ] Photos can be swiped, opened full screen and closed
- [ ] RSVP: choose Attending / Can't come / Maybe, change the number of people, write a message, send. Reload the page: your answer is still there
- [ ] The footer shows “Made with ❤ by …” (unless the plan hides it)
- [ ] Rotate the phone sideways: nothing breaks

**Settings**
- [ ] Turn on “Reduce motion” in the phone's accessibility settings: animations are calmer, everything still works
- [ ] Open the link on slow mobile data: the opening screen appears quickly; the rest loads while the guest looks at it

## B. The customer portal (log in at /login on the phone)

- [ ] Login works; the password can be shown/hidden
- [ ] The row of tabs at the top scrolls sideways and every page opens
- [ ] **Details:** couple names show 🔒 and cannot be edited; the message text boxes are comfortable to type in; Urdu typing works
- [ ] **Events:** add an event (date and time pickers work), edit, delete, move
- [ ] **Family:** add people, drag the handle to reorder (and the arrow buttons work)
- [ ] **Guests:** add a guest, paste a list, tap **Send on WhatsApp** (opens the right chat with the message), **Copy link**
- [ ] **Replies:** numbers per event; the CSV download opens in Excel / Google Sheets
- [ ] **Photos:** choose several photos from the phone gallery; they upload and show
- [ ] **Music:** the preview play buttons work; Premium: upload an MP3
- [ ] **Account:** change the password, then log in again

## C. The public website

- [ ] Homepage: the menu button opens the menu; the green WhatsApp button works
- [ ] **Designs:** each card's phone preview moves; **View Live Demo** and **Order This Design** work
- [ ] The demo page's top bar: Back, brand and the green “Order this design” button (opens WhatsApp with the message ready)

## D. Admin (you, on the phone)

- [ ] The bottom bar shows six icons and every page opens
- [ ] **New invitation** form is usable with one hand; the WhatsApp message is created
- [ ] Open an invitation, change something, see it in the audit log

## E. Speed check (optional)

In Chrome on a computer: open the invitation link → right-click → *Inspect* → *Lighthouse* → *Mobile* → *Analyze page load*. Aim for **80+ Performance**. (The strict built-in test simulates a slow phone on slow 4G.)
