/**
 * Creates a contact group with a letter header and an empty sublist
 * @param {String} letter - Letter used to create a contact group with a header displaying the letter and an empty sublist for the contacts starting with that letter
 * @returns {HTMLString} -  Element for a contact group
 */
function createContactGroup(letter) {
    return `<div class="contact_group flex-column">
    <div class="letter flex-row">${letter}</div>
    <div class="line_container flex-row"><div class="horizontalLine"></div></div>
    <div id="group${letter}" class="contact_sublist flex-column"></div></div>`;
}

/**
 * Creates a HTML div element for a contact with their initials, name, and email
 * @param {contact} contact - Contact object that contains information such as their `id`, `initials`, `name`, and `email`.
 * @returns {HTMLString} - Element with the provided `contact` object's properties such as `id`, `initials`, `name`, and `email`
 */
function createContact(contact) {
    return `<div id="${contact.id}" class="contact list_contact flex-row curser" onclick="openContactInfo(${contact.id})">
    <div id="contact_initials${contact.id}" class="contact_initials grid">${contact.initials}</div>
    <div class="contact_name flex-column">
        <span class="contact_sublist_name">${contact.name}</span>
        <span class="contact_sublist_email">${contact.email}</span>
    </div></div>`;
}

/**
 * Returns the HTML-Template for the contact-info buttons
 * @param {Number} index - Index of the contact of the contacts array used as an argument for the deleteContact function when the trash icon is clicked
 * @param {Number} id - Id of the contact
 * @returns {HTMLString} - elements that include an icon for deleting a contact and an image for editing a contact
 */
function createContactInfoButtons(index, id) {
    return `<i id="mobile_contact_trash" class='bx bx-trash' onclick="deleteContact(${index})"></i>
    <img id="mobile_edit_contact_img" class="edit_contact_img" src="src/img/frame100.svg" alt="" onclick="openContactMenu('edit', ${id})">`
}