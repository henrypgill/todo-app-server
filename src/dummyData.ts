import { ServerToDoData } from "./db";

interface DummyInfo {
  title: string;
  description: string;
}

export function createDummyTodos(startingID: number): ServerToDoData[] {
  let idCounter = startingID;
  const dummyInfoArr = getDummyTodoTasks();

  const retServerToDoData = dummyInfoArr.map((d) => dummyInfoToDbItemWithId(d));

  function dummyInfoToDbItemWithId(dummyInfo: DummyInfo) {
    const retData: ServerToDoData = {
      id: ++idCounter,
      title: dummyInfo.title,
      description: dummyInfo.description,
      status: "incomplete",
      created: getRandomCreatedDate(),
      due: getRandomDueDate(),
    };
    return retData;
  }

  function getRandomCreatedDate(): number {
    const fromDate = new Date(2023, 4, 1, 0, 0);
    const toDate = new Date();
    const randomDate = Math.floor(
      Math.random() * (toDate.getTime() - fromDate.getTime())
    );

    return randomDate;
  }

  function getRandomDueDate(): number {
    const fromDate = new Date();
    const toDate = new Date(2024, 4, 1, 0, 0);
    const randomDate = Math.floor(
      Math.random() * (toDate.getTime() - fromDate.getTime())
    );
    return randomDate;
  }

  return retServerToDoData;
}

export function getDummyTodoTasks(): DummyInfo[] {
  const dummyTodoTaskList = [
    {
      title: "Complete homework",
      description: "Finish the math and science assignments by tonight.",
    },
    {
      title: "Go grocery shopping",
      description: "Buy fruits, vegetables, milk, and bread from the store.",
    },
    {
      title: "Write a blog post",
      description: "Create a blog post about recent trends in technology.",
    },
    {
      title: "Exercise",
      description: "Go for a 30-minute jog in the park.",
    },
    {
      title: "Prepare for the meeting",
      description:
        "Review the presentation slides and gather necessary documents.",
    },
    {
      title: "Call Mom",
      description: "Check-in with mom and ask about her day.",
    },
    {
      title: "Fix the leaky faucet",
      description: "Use a wrench to tighten the faucet and stop the leak.",
    },
    {
      title: "Book flight tickets",
      description:
        "Find and book round-trip tickets for the vacation next month.",
    },
    {
      title: "Read a book",
      description: "Start reading 'The Great Gatsby' for the book club.",
    },
    {
      title: "Pay utility bills",
      description:
        "Pay electricity, water, and internet bills before the due date.",
    },
    {
      title: "Practice guitar",
      description: "Spend at least 1 hour practicing chords and scales.",
    },
    {
      title: "Organize closet",
      description: "Sort and declutter clothes in the closet.",
    },
    {
      title: "Complete online course",
      description: "Finish the last two modules of the web development course.",
    },
    {
      title: "Fix the car's engine",
      description: "Take the car to the mechanic and get the engine repaired.",
    },
    {
      title: "Plan birthday party",
      description:
        "Decide on the venue, guest list, and menu for the birthday celebration.",
    },
    {
      title: "Water the plants",
      description: "Give the indoor and outdoor plants their weekly watering.",
    },
    {
      title: "Write thank-you notes",
      description:
        "Send thank-you notes to friends for their thoughtful gifts.",
    },
    {
      title: "Renew gym membership",
      description: "Extend the gym membership for another three months.",
    },
    {
      title: "Backup important files",
      description:
        "Create a backup of important documents and photos on an external drive.",
    },
    {
      title: "Volunteer at the shelter",
      description: "Spend a few hours helping out at the local animal shelter.",
    },
    {
      title: "Study for the exam",
      description:
        "Review notes and textbooks to prepare for the upcoming exam.",
    },
    {
      title: "Fix the broken chair",
      description: "Use wood glue and screws to repair the wobbly chair.",
    },
    {
      title: "Cook a new recipe",
      description: "Try out the pasta recipe from the new cookbook.",
    },
    {
      title: "Create a budget",
      description: "Plan the monthly expenses and savings in a spreadsheet.",
    },
    {
      title: "Practice meditation",
      description: "Spend 15 minutes meditating to relax the mind.",
    },
    {
      title: "Clean the garage",
      description: "Organize tools and equipment in the garage.",
    },
    {
      title: "Learn a magic trick",
      description:
        "Watch online tutorials and learn a new magic trick to amaze friends.",
    },
    {
      title: "Take a dance class",
      description: "Enroll in a salsa dance class for the weekend.",
    },
    {
      title: "Write a letter to a friend",
      description: "Pen a heartfelt letter to a friend living far away.",
    },
    {
      title: "Plan weekend getaway",
      description: "Research and decide on a destination for a weekend trip.",
    },
  ];
  return dummyTodoTaskList;
}
