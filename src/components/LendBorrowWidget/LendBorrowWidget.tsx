import styles from "./LendBorrowWidget.module.scss";
import Link from "next/link";

interface LendBorrowWidgetProps {
  active: "lend" | "borrow";
}

const LendBorrowWidget = ({ active }: LendBorrowWidgetProps) => {
  return (
    <div className={ styles.widget }>
      <Link
        href={ active === "borrow" ? "#" : "/borrow" }
        className={ `${ styles.option } ${
          active === "borrow" ? styles.active : styles.inactive
        }` }
      >
        Borrow
      </Link>
      <div className={ styles.divider }/>
      <Link
        href={ active === "lend" ? "#" : "/lend" }
        className={ `${ styles.option } ${
          active === "lend" ? styles.active : styles.inactive
        }` }
      >
        Lend
      </Link>
    </div>
  );
};

export default LendBorrowWidget;
