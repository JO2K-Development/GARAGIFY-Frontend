import styles from "./LendBorrowList.module.scss";
import Image from "next/image";
import { Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import Lending from "@/types/lending";
import Borrowing from "@/types/borrowing";

interface LendBorrowListProps {
  label: string;
  content: Lending[] | Borrowing[];
  onCancel: (borrow_id: string) => void;
}

const LendBorrowList = ({
                          label,
                          content,
                          onCancel,
                        }: LendBorrowListProps) => {
  const formatDateParts = (dateStr: string) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');

    return {
      date: `${ dd }.${ mm }.${ yyyy }`,
      time: `${ HH }:${ MM }`,
    };
  };

  const isLending = (item: Lending | Borrowing): item is Lending => {
    return 'borrowers' in item;
  };

  return (
    <div className={ styles.BorrowingList }>
      <div className={ styles.BorrowingListHeader }>
        <div>{ label }</div>
        <FilterOutlined/>
      </div>
      <div className={ styles.BorrowingListInner }>
        { content.map((item) => {
          return (
            <div key={ item.id } className={ styles.BorrowingItem }>
              <Image
                src="/images/pfp.png"
                alt={ `profile picture` }
                width={ 30 }
                height={ 30 }
                className={ styles.ProfilePicture }
              />
              <div className={ styles.BorrowingItemContent }>
                <div>
                  <span className={ styles.BorrowingItemDate }>
                    { (() => {
                      const start = formatDateParts(item.start_date);
                      const end = formatDateParts(item.end_date);
                      return (
                        <>
                          <span className={ styles.DatePart }>{ start.date }</span>{ " " }
                          (<span className={ styles.TimePart }>{ start.time }</span>) -{ " " }
                          <span className={ styles.DatePart }>{ end.date }</span>{ " " }
                          (<span className={ styles.TimePart }>{ end.time }</span>)
                        </>
                      );
                    })() }
                  </span>
                </div>
                <div>
                  { isLending(item) ? (
                    item.borrowers && item.borrowers.length > 0 && (
                      <span className={ styles.BorrowingItemOwner }>
                        borrowed by: { item.borrowers.map((b: any) => b.email).join(', ') }
                      </span>
                    )
                  ) : (
                    <span className={ styles.BorrowingItemOwner }>
                      borrowed from: { item.owner.email }
                    </span>
                  ) }
                </div>
              </div>
              <Button type="primary" onClick={ () => onCancel(item.id) }>
                Cancel
              </Button>
            </div>
          );
        }) }
      </div>
    </div>
  );
};

export default LendBorrowList;
