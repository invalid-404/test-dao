import React from 'react';

interface JoinTheDaoProps {
  isAboveThreshold: Boolean;
  score: string;
}

const JoinTheDao: React.FC<JoinTheDaoProps> = ({ isAboveThreshold, score }) => {
    if (isAboveThreshold) {
        return <ContentAboveThreshold />;
    } else {
        return <ContentBelowThreshold score={score} isAboveThreshold={false} />;
    }
};

const ContentAboveThreshold = () => {
    return (
        <>
            <br />
            <br />
            <p>🎉🎉🎉</p>
            <p><b>Welcome to Passport DAO!</b></p>
            <br />
            <p>Passport DAO is a fictional DAO for Passport builders.</p>
            <p>Passport DAO does not really exist, it is just an example made up for the purposes of this tutorial!</p>
            <p>However, since you have a Passport with a score 20 and you have built this demo app, </p>
            <p>you might enjoy the Gitcoin discord, where other Passport builders hang out.</p>
            <br />
            <p></p>
            <br />
        </>
    )
}

const ContentBelowThreshold: React.FC<JoinTheDaoProps> = ({ score }) => {
    let text: string = 'Your current Passport score is ${score}'
    if (score == '') {
        text = "You do not yet have a Passport score. Maybe you haven't created or connected your Passport?"
    }
    return (
        <>
            <br />
            <p>😭😭😭</p>
            <br />
            <p>We would love you to join our DAO.</p>
            <br />
            <p>Unfortunately, you do not quite meet the eligibility criteria.</p>
            <p> {text} </p>
            <p>You can go to the <a href="https://passport.gitcoin.co">Passport App</a>and add more stamps to your Passport.</p>
            <p>When you have enough stamps to generate a score above 20, you can come back and join our DAO!</p>
            <br />
        </>
    )
}

export default JoinTheDao;