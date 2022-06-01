const awsCustomConfig={
    API: {
        endpoints: [
            {
                name: "enercostAPI",
                endpoint: "https://72si3r1i43.execute-api.us-east-2.amazonaws.com/test"
            }
        ]
    },
    "aws_project_region": "us-east-2",
    "aws_cognito_identity_pool_id": "us-east-2:4f3b168f-384d-4477-97fb-a61a0f6c6c7c",
    "aws_cognito_region": "us-east-2",
    "aws_user_pools_id": "us-east-2_gXvYmTlCU",
    "aws_user_pools_web_client_id": "4jvprq4u11cv1kdafvcoqm6720",
    "oauth": {},
    "aws_cognito_username_attributes": [
        "EMAIL"
    ],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ]
} ;
 export default awsCustomConfig