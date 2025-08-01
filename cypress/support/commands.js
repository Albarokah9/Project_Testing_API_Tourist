// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// Simple API commands
Cypress.Commands.add('apiGet', (endpoint) => {
    return cy.request({
        method: 'GET',
        url: endpoint,
        failOnStatusCode: false,
    });
});

Cypress.Commands.add('apiPost', (endpoint, body) => {
    return cy.request({
        method: 'POST',
        url: endpoint,
        body: body,
        failOnStatusCode: false,
    });
});

Cypress.Commands.add('apiPut', (endpoint, body) => {
    return cy.request({
        method: 'PUT',
        url: endpoint,
        body: body,
        failOnStatusCode: false,
    });
});

Cypress.Commands.add('apiDelete', (endpoint) => {
    return cy.request({
        method: 'DELETE',
        url: endpoint,
        failOnStatusCode: false,
    });
});
