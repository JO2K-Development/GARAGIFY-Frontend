import LendBorrowList from "../../LendBorrowList/LendBorrowList";
import styles from "./MyLendingsView.module.scss";
import LendBorrowWidget from "@/components/LendBorrowWidget/LendBorrowWidget";
import useMyLendingsView from "./useMyLendingsView";

const lendings = [
  {
    id: "1",
    start_date: "2025-06-01T05:20:34.551Z",
    end_date: "2025-06-04T14:46:34.551Z",
    borrowers: [
      { email: "user1@example.com", user_id: "user1" },
      { email: "user2@example.com", user_id: "user2" }
    ],
  },
  {
    id: "2",
    start_date: "2025-06-04T14:46:34.551Z",
    end_date: "2025-06-04T14:46:34.551Z",
    borrowers: []
  }
];

const MyLendingsView = () => {
  const {
    onCancel
  } = useMyLendingsView();
  return (
    <div className={ styles.MyLendingsView }>
      <LendBorrowWidget active="lend"/>
      <LendBorrowList label="Your lendings" content={ lendings } onCancel={ onCancel }/>
    </div>
  );
}

export default MyLendingsView;