import React, { useState } from "react";
import { Modal, Button } from "antd";

const QuizGamePopup = () => {
  const questions = [
    { question: "Is blockchain secure?", correctAnswer: true },
    {
      question: "Do you need a wallet for every transaction?",
      correctAnswer: false,
    },
    { question: "Are crypto transactions reversible?", correctAnswer: false },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<null | boolean>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  return (
    <div>
      <Button type="primary" onClick={openModal}>
        Start Transaction Quiz
      </Button>
      <Modal
        title="Transaction Quiz"
        visible={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
      >
        {currentStep < questions.length ? (
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold">
              Step {currentStep + 1} of {questions.length}
            </h2>
            <p className="mt-4">{questions[currentStep].question}</p>

            {!showFeedback && (
              <div className="mt-6 flex gap-4">
                <Button type="primary" onClick={() => handleAnswer(true)}>
                  True
                </Button>
                <Button onClick={() => handleAnswer(false)}>False</Button>
              </div>
            )}

            {showFeedback && (
              <div className="mt-4 text-center">
                {selectedAnswer === questions[currentStep].correctAnswer ? (
                  <p className="text-green-600 font-medium">Correct!</p>
                ) : (
                  <p className="text-red-600 font-medium">
                    Incorrect! The correct answer is{" "}
                    <span className="font-bold">
                      {questions[currentStep].correctAnswer ? "True" : "False"}
                    </span>
                    .
                  </p>
                )}
                <Button type="default" onClick={nextStep} className="mt-4">
                  {currentStep === questions.length - 1
                    ? "Finish Quiz"
                    : "Next Step"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold">Quiz Completed!</h2>
            <p className="mt-2">Great job learning about transactions!</p>
            <Button type="primary" onClick={closeModal} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuizGamePopup;
