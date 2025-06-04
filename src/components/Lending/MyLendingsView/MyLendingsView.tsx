import LendBorrowList from "../../LendBorrowList/LendBorrowList";
import styles from "./MyLendingsView.module.scss";
import LendBorrowWidget from "@/components/LendBorrowWidget/LendBorrowWidget";
import useMyLendingsView from "./useMyLendingsView";

const MyLendingsView = () => {
  const {
    content,
    onCancel
  } = useMyLendingsView();
  return (
    <div className={ styles.MyLendingsView }>
      <LendBorrowWidget active="lend"/>
      <LendBorrowList label="Your lendings" content={ content } onCancel={ onCancel }/>
    </div>
  );
}

export default MyLendingsView;