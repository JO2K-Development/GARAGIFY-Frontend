import LendBorrowList from "../../LendBorrowList/LendBorrowList";
import styles from "./MyBorrowingsView.module.scss";
import useMyBorrowingsView from "@/components/Borrowing/MyBorrowingsView/useMyBorrowingsView";
import LendBorrowWidget from "@/components/LendBorrowWidget/LendBorrowWidget";

const borrowings = [
  {
    id: "1",
    start_date: "2025-06-01T05:20:34.551Z",
    end_date: "2025-06-04T14:46:34.551Z",
    owner: { email: "user1@example.com" }
  },
  {
    id: "2",
    start_date: "2025-06-04T14:46:34.551Z",
    end_date: "2025-06-04T14:46:34.551Z",
    owner: { email: "user2@example.com" }
  }
];

const MyBorrowingsView = () => {
  const {
    onCancel
  } = useMyBorrowingsView();
  return (
    <div className={ styles.MyBorrowingsView }>
      <LendBorrowWidget active="borrow"/>
      <LendBorrowList label="Your borrows" content={ borrowings } onCancel={onCancel}/>
    </div>
  );
}

export default MyBorrowingsView;