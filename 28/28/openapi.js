let openapi =
{
    openapi: '3.0.1',
    info: {
        version: '1.0.0', title: 'Phonebook', description: 'Phone number managment API',
        termsOfService: 'http://api_url/terms/',
        contact: { name: 'Belstu, POIT', email: 'poit@belstu.by', url: 'https://belstu.by/' },
        licence: { name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html' }
    },
    paths: {
        '/TS': {
            get: {
                tags: ['REST Api Request'], description: 'Get list of phone numbers', operationId: 'getPhoneNumbers',
                responses: {
                    '200': {
                        description: 'Phone number list',
                        content: {
                            'application/json':
                            {
                                schema: { type: 'array', items: { type: 'object' } },
                                example: [{ Id: 1, phoneNumber: 375298415574, name: 'Sergey' },
                                { Id: 3, phoneNumber: 375298415574, name: 'Gebaut' },]
                            }
                        }
                    },
                    '500': {
                        description: 'Iternal server error',
                        content: {
                            'application/json':
                            {
                                schema: { type: 'object' },
                                example: { code: 500, message: 'Iternal server error' }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['REST Api Request'], description: 'Add new phone numbers', operationId: 'addPhoneNumbers',
                responses: {
                    '201': {
                        description: 'Add new phone number',
                        content: {
                            'application/json':
                            {
                                schema: { type: 'object' },
                                example: [{ Id: 1, phoneNumber: 375849685654, name: 'Sergey' }]
                            }
                        }
                    },
                    '400': {
                        description: 'Missing parameters',
                        content: {
                            'application/json':
                            {
                                schema: { type: 'object' },
                                example: { message: 'Student is missing' }
                            }
                        }
                    }
                },
                requestBody: {
                    content: {
                        'application/json': {
                            name: 'contact',
                            schema: { type: 'object' },
                            required: true,
                            description: 'Phone number',
                            example: { Id: 1, phoneNumber: 3598415673, name: 'Sergey' }
                        }
                    }
                }
            },
            put: {
                tags: ['REST Api Request'], description: 'editPhoneNumber', operationId: 'editPhoneNumbers',
                responses: {
                    '200': {
                        description: 'Edit phone number',
                        content: {
                            'application/json':
                            {
                                schema: { type: 'object' },
                                example: [{ Id: 1, phoneNumber: 375898415567, name: 'Sergey' }]
                            }
                        }
                    },
                    '400': {
                        description: 'Missing parameters',
                        content: {
                            'application/json':
                            {
                                schema: { type: 'object' },
                                example: { message: 'Student is missing' }
                            }
                        }
                    }
                },
                requestBody: {
                    content: {
                        'application/json': {
                            name: 'contact',
                            schema: { type: 'object' },
                            required: true,
                            description: 'Phone number',
                            example: { Id: 1, phoneNumber: 375898415567, name: 'Sergey' }
                        }
                    }
                }
            },
            delete: {
                tags: ['REST Api Request'], description: 'Delete phone numbers', operationId: 'delPhoneNumbers',
                parameters: [
                    {
                        name: 'phoneNumberId',
                        in: 'query',
                        schema: { type: 'int' },
                        required: true,
                        description: 'Phone Number Id'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Delete phone number',
                        content: {
                            'application/json':
                            {
                                schema: { type: 'object' },
                                example: [{ Id: 1, phoneNumber: 375898415567, name: 'Sergey' }]
                            }
                        }
                    },
                    '400': {
                        description: 'Missing parameters',
                        content: {
                            'application/json':
                            {
                                schema: { type: 'object' },
                                example: { message: 'Student id is missing' }
                            }
                        }
                    }
                },
            },
        }
    },
};

module.exports = openapi;