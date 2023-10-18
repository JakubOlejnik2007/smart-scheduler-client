import { hasGrantedAllScopesGoogle, useGoogleLogin } from "@react-oauth/google";

const GoogleAuth = () => {
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log(tokenResponse)

            console.log(hasGrantedAllScopesGoogle(
                tokenResponse,
                "https://www.googleapis.com/auth/calendar.readonly"
            ))

        },
    });

    return (
        <div>
            <h2>Zaloguj się z Google</h2><button onClick={() => login()}>Sign in with Google 🚀 </button>;
        </div>
    );
};

export default GoogleAuth;
