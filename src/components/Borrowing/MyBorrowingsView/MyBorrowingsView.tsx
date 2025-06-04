import LendBorrowList from "../../LendBorrowList/LendBorrowList";
import styles from "./MyBorrowingsView.module.scss";

const borrowings = [
  { id: "1", start_date: "2025-06-01T05:20:34.551Z", end_date: "2025-06-04T14:46:34.551Z", owner: { email: "user1@example.com" } },
  { id: "2", start_date: "2025-06-04T14:46:34.551Z", end_date: "2025-06-04T14:46:34.551Z", owner: { email: "user2@example.com" } }
];

const MyBorrowingsView = () => {
  return (
    <div className={ styles.MyBorrowingsView }>
      <h1>My Borrowings</h1>
      <p>This feature is under development.</p>
      <p>Please check back later.</p>
      <LendBorrowList label="Your borrows" content={borrowings} onCancel={(id: string) => console.log(id)} />
    </div>
  );
}

export default MyBorrowingsView;