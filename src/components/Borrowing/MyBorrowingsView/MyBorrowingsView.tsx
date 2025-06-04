import LendBorrowList from "../../LendBorrowList/LendBorrowList";
import styles from "./MyBorrowingsView.module.scss";
import useMyBorrowingsView from "@/components/Borrowing/MyBorrowingsView/useMyBorrowingsView";
import LendBorrowWidget from "@/components/LendBorrowWidget/LendBorrowWidget";

const MyBorrowingsView = () => {
  const {
    content,
    onCancel
  } = useMyBorrowingsView();
  console.log(content);
  return (
    <div className={ styles.MyBorrowingsView }>
      <LendBorrowWidget active="borrow"/>
      <LendBorrowList label="Your borrows" content={ content } onCancel={onCancel}/>
    </div>
  );
}

export default MyBorrowingsView;