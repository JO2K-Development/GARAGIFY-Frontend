import styles from "./LendBorrowList.module.scss";
import Image from "next/image";
import { Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import lending from "@/types/lending";
import borrowing from "@/types/borrowing";

interface LendBorrowListProps {
  label: string;
  content: lending[] | borrowing[];
  onCancel: (borrow_id: string) => void;
}

const LendBorrowList = ({
                          label,
                          content,
                          onCancel,
                        }: LendBorrowListProps) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const yyyy = date.getFullYear();
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');

    return `${dd}.${mm}.${yyyy} (${HH}:${MM})`;
  };

  return (
    <div className={styles.BorrowingList}>
      <div className={styles.BorrowingListHeader}>
        <div>{label}</div>
        <FilterOutlined />
      </div>
      <div className={styles.BorrowingListInner}>
        {content.map((item) => {
          const user = item.owner ?? item.borrower;
          return (
            <div key={item.id} className={styles.BorrowingItem}>
              <Image
                src="/images/pfp.png"
                alt={`${user.email} profile picture`}
                width={30}
                height={30}
                className={styles.ProfilePicture}
              />
              <div className={styles.BorrowingItemContent}>
                <div>
                  <span className={styles.BorrowingItemDate}>
                    {formatDate(item.start_date)} - {formatDate(item.end_date)}
                  </span>
                </div>
                <div>
                  <span className={styles.BorrowingItemOwner}>
                    borrowed from: {item.owner.email}
                  </span>
                </div>
              </div>
              <Button type="primary" onClick={() => onCancel(item.id)}>
                Cancel
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LendBorrowList;
