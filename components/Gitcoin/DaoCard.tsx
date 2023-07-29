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
            <p>🎉🎉🎉</p>
            <p>Welcome to Tera-DAO!</p>
        </>
    )
}

const ContentBelowThreshold: React.FC<JoinTheDaoProps> = ({ score }) => {
    let text: string = `Your current Passport score is ${score}`
    if (score == '') {
        text = "Maybe you haven't created or connected your Passport?"
    }
    return (
        <>
            <p>Your Passport Score must be greater than 10</p>
            <p>Unfortunately, you do not meet the eligibility criteria.</p>
            <p> {text} </p>
            
        </>
    )
}

export default JoinTheDao;