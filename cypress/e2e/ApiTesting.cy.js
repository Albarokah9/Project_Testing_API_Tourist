describe('Tourists API Simple Tests', () => {
    describe('GET /tourist', () => {
        it.only('should get all tourists', () => {
            cy.apiGet('/tourist').then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array');

                if (response.body.length > 0) {
                    expect(response.body[0]).to.have.property('id');
                    expect(response.body[0]).to.have.property('tourist_name');
                    expect(response.body[0]).to.have.property('tourist_email');
                    expect(response.body[0]).to.have.property('tourist_location');
                    expect(response.body[0]).to.have.property('createdAt');
                    expect(response.body[0]).to.have.property('updatedAt');
                }
            });
        });
    });

    describe('POST /tourist', () => {
        it('should create new tourist', () => {
            const newTourist = {
                tourist_name: 'Test User',
                tourist_email: `test.${Date.now()}@gmail.com`,
                tourist_location: 'Test City',
            };

            cy.apiPost('/tourist', newTourist).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.tourist_name).to.eq(newTourist.tourist_name);
                expect(response.body.tourist_email).to.eq(newTourist.tourist_email);
                expect(response.body.tourist_location).to.eq(newTourist.tourist_location);
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('createdAt');
                expect(response.body).to.have.property('updatedAt');

                // Save ID for other tests
                cy.wrap(response.body.id).as('createdTouristId');
            });
        });

        it('should reject empty data', () => {
            cy.apiPost('/tourist', {}).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq('All fields required');
            });
        });
    });

    describe('GET /tourist/:id', () => {
        it('should get tourist by id', () => {
            // First get all tourists to get an ID
            cy.apiGet('/tourist').then((response) => {
                if (response.body.length > 0) {
                    const touristId = response.body[0].id;

                    cy.apiGet(`/tourist/${touristId}`).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body.id).to.eq(touristId);
                    });
                }
            });
        });

        it('should return 404 for non-existent tourist', () => {
            cy.apiGet('/tourist/99999').then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body.error).to.eq('Tourist not found');
            });
        });
    });

    describe('PUT /tourist/:id', () => {
        it('should update tourist', () => {
            // Create a tourist first
            const newTourist = {
                tourist_name: 'Update Test',
                tourist_email: `update.${Date.now()}@gmail.com`,
                tourist_location: 'Update City',
            };

            cy.apiPost('/tourist', newTourist).then((createResponse) => {
                const touristId = createResponse.body.id;

                const updateData = {
                    tourist_name: 'Updated Name',
                    tourist_email: `updated.${Date.now()}@gmail.com`,
                    tourist_location: 'Updated City',
                };

                cy.apiPut(`/tourist/${touristId}`, updateData).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.tourist_name).to.eq(updateData.tourist_name);
                    expect(response.body.tourist_location).to.eq(updateData.tourist_location);
                });
            });
        });
    });

    describe('DELETE /tourist/:id', () => {
        it('should delete tourist', () => {
            // Create a tourist first
            const newTourist = {
                tourist_name: 'Delete Test',
                tourist_email: `delete.${Date.now()}@gmail.com`,
                tourist_location: 'Delete City',
            };

            cy.apiPost('/tourist', newTourist).then((createResponse) => {
                const touristId = createResponse.body.id;

                cy.apiDelete(`/tourist/${touristId}`).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.message).to.eq('Tourist deleted successfully');
                });

                // Verify it's deleted
                cy.apiGet(`/tourist/${touristId}`).then((response) => {
                    expect(response.status).to.eq(404);
                });
            });
        });
    });
});
