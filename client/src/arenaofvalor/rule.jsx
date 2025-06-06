import React from 'react';
import 'animate.css';
import { useEffect } from 'react';
const RuleBook = () => {
  useEffect(() => {
    const scrollToTop = () => {
      document.documentElement.scrollTop = 0;
    };
    setTimeout(scrollToTop, 0);
    document.title = 'Luật giải đấu Arena Of Valor';
  }, []);
  return (
    <div className="animate__animated animate__fadeIn max-w-6xl mx-auto p-6 bg-base-100 lg:mt-24 lg:mb-16 mt-[72px] mb-8 rounded-lg text-base-content">
      <h1 className="lg:text-5xl sm:text-4xl text-3xl font-bold text-center mb-10 text-primary">
        Luật Lệ Giải Liên Quân Mobile - THPT Phú Nhuận (Season 2)
      </h1>
      <Section
        title={
          <div className="text-3xl font-bold text-secondary mb-3 uppercase text-center">
            Giới thiệu
          </div>
        }
        content={
          <>
            <div>
              Kính gửi các bạn đã đăng ký GIẢI LIÊN QUÂN MOBILE GIỮA CÁC LỚP TRƯỜNG THPT PHÚ NHUẬN:
              SEASON 2.
            </div>
            <div>
              Lời nói đầu tiên xin thay mặt Dong Chuyen Nghiep gửi lời chào chân thành và cảm ơn sâu
              sắc đến với các thành viên đã/sẽ đăng kí giải đấu lần này.
            </div>
            <div>
              Sau khi tổng hợp ý kiến từ các thành viên trong Discord, chúng mình quyết định tổ chức
              một giải đấu Liên Quân Mobile giữa các lớp trong Trường, nhằm tìm ra đội có thành tích
              xuất sắc nhất. Đặc biệt, ngoài các giải thưởng hạng nhất, nhì, ba dành cho đội thi
              đấu, phần Pick’em sẽ có giải thưởng riêng (sẽ được thông báo sau)
            </div>
            <h3 className="text-primary text-xl font-bold text-center my-4">GIẢI THƯỞNG</h3>
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-primary w-full">
                <thead>
                  <tr>
                    <th className="border border-primary px-4 py-2 text-center">
                      <span className="hidden lg:inline">Hạng 1</span>
                      <span className="lg:hidden inline">1ST</span>
                    </th>
                    <th className="border border-primary px-4 py-2 text-center">
                      <span className="hidden lg:inline">Hạng 2</span>
                      <span className="lg:hidden inline">2ND</span>
                    </th>
                    <th className="border border-primary px-4 py-2 text-center">
                      <span className="hidden lg:inline">Hạng 3</span>
                      <span className="lg:hidden inline">3RD</span>
                    </th>
                    <th className="border border-primary px-4 py-2 text-center">Pick'em</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-primary px-4 py-2 text-center">
                      <span className="hidden lg:inline">500.000 VND</span>
                      <span className="lg:hidden inline">500K VND</span>
                    </td>
                    <td className="border border-primary px-4 py-2 text-center">
                      <span className="hidden lg:inline">300.000 VND</span>
                      <span className="lg:hidden inline">300K VND</span>
                    </td>
                    <td className="border border-primary px-4 py-2 text-center">
                      <span className="hidden lg:inline">200.000 VND</span>
                      <span className="lg:hidden inline">200K VND</span>
                    </td>
                    <td className="border border-primary px-4 py-2 text-center">TBD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        }
      />
      <Section
        title="I. Chat Trong Trận Đấu"
        content="Được phép chat all, nhưng với những tình huống máy chủ Liên Quân nhận thấy toxic và xúc phạm người khác (“chỉ cần bạn có mặt thắng thua không quan trọng”) chúng mình sẽ thẳng tay trừng phạt người chơi đó tùy theo những mức độ như sau:"
        rules={[
          'Lần đầu tiên sẽ cảnh cáo.',
          'Lần thứ hai sẽ bị phạt theo 5k/lần phạm luật.',
          'Cố tình phạm luật sẽ bị ban và team sẽ bị xử thua 0/3 tất cả các trận còn lại của giải đấu.',
        ]}
      />

      <Section
        title="II. Thời Gian Trước Trận Đấu"
        content={
          <>
            Thời gian các bạn phải vào discord trước 10 phút trận đấu bắt đầu và để công bằng hơn
            các bạn phải có mặt trong discord{' '}
            <a className="text-primary" href="https://discord.gg/fFXxUNvj">
              <strong>THPT Phú Nhuận</strong>
            </a>{' '}
            để chúng mình dễ kiểm soát được là ai đang chơi trong trận đó. Trường hợp các bạn{' '}
            <strong>THẬT SỰ</strong> bận một việc gì đó phải báo cho admin discord trước 12h trưa
            (giờ Việt Nam) hôm diễn ra thi đấu để delay các trận đấu 10-15 phút.
          </>
        }
        rules={[
          'Mỗi đội có 1 quyền delay trận đấu.',
          'Phần thời gian dời lịch chúng mình sẽ không giải quyết những trường hợp XIN thay đổi lịch đã được đặt để các bạn thi đấu nên vui lòng các bạn sắp xếp thời gian phù hợp nhé.',
          'Mỗi trận đấu sẽ được quyền tạm ngưng vì vấn đề kỹ thuật (trường hợp ngoại lệ: wifi bị hư hỏng vì mưa, vịt vào nhà :D, … và những tình huống oái ăm khác) nếu có bằng chứng thuyết phục sau khi đã khắc phục hậu quả nếu không thì chúng mình sẽ xử lý thua cuộc sau khi trận đấu kết thúc.',
        ]}
        smallerrules={[
          'Trong trường hợp này thì vấn đề về máy móc (pin, hết bộ nhớ, máy móc bị reset, ….) sẽ không được giải quyết và xử lý thua cuộc sau trận vì lý do câu giờ',
          'Trường hợp các bạn bị mất wifi vui lòng dự phòng 3G/4G trước trận để nhanh chóng khắc phục tình trạng, chúng mình sẽ không giải quyết đợi đến khi wifi được khắc phục xong mới bắt đầu trận đấu.',
        ]}
      />

      <Section
        title="III. Các Vấn Đề Sau Trận Đấu"
        content="Bọn mình sẽ không giải quyết các vấn đề sau trận đấu đã kết thúc. ĐÂY CHỈ LÀ GAME và mọi việc xảy ra trong game đều là dĩ hòa vi quý. Game sẽ có người thắng người thua nếu như có mọi việc xảy ra sau khi trận đấu kết thúc như: khiêu khích đối thủ bằng các sang lớp các bạn để nói về trận đấu đã qua, gây gỗ nhau qua nền tảng mạng xã hội khác thì sẽ xử lý như sau:"
        rules={[
          'Trường hợp các bạn thắng trận: chúng mình sẽ xử lý thua cuộc với trận đấu gần nhất các bạn chiến thắng.',
          'Trường hợp các bạn thua cuộc: chúng mình sẽ cấm vĩnh viễn các bạn khỏi tất cả giải đấu thuộc Dong Chuyen Nghiep.',
        ]}
      />

      <Section
        title="IV. Vấn Đề Nội Bộ Trong Đội"
        content={
          <>
            <strong>THÀNH VIÊN MA:</strong> Các bạn chú ý việc đăng ký đội hình đã được update trên
            website của chúng mình và nếu các bạn đã dùng một người khác đội hình đã đăng kí tùy
            theo trường hợp sẽ xử lý như sau:
          </>
        }
        rules={[
          'Xử lý thua cuộc với team phạm luật và cấm các thành viên không được tham gia các giải đấu thuộc Dong Chuyen Nghiep trong 4 tháng.',
          'Đối với những bạn đã đăng ký 2 team chúng mình sẽ xử lý thua cuộc 2 team bạn đã đăng ký và không cho bạn đăng ký tham gia các giải đấu còn lại của Dong Chuyen Nghiep trong 4 tháng (Trường hợp bạn đăng ký cả 2 team đã được sự chấp thuận từ admin Dong Chuyen Nghiep là ngoại lệ).',
          'Thay đổi đội hình có nghĩa là thêm, thay thế hoặc xóa Tuyển thủ đã đăng ký với BTC khỏi danh sách các thành viên của Đội tuyển. Việc thay đổi phải được sự chấp thuận của BTC Dong Chuyen Nghiep. Đội hình đội bị khóa và không được thay đổi sau khi Đội tuyển gửi thông tin đội hình cho BTC theo thời gian được quy định. Tất cả các thay đổi Đội tuyển thực hiện sau khi đội hình bị khóa sẽ phải chịu các hình phạt hoặc bị từ chối theo quyết định của BTC giải đấu Dong Chuyen Nghiep.',
          'Nếu Đội tuyển muốn giải phóng một Tuyển thủ khỏi đội hình đã được đăng ký (dù là vị trí chính hay dự bị), Đội tuyển có trách nhiệm phải thông báo vấn đề này với BTC giải đấu Dong Chuyen Nghiep và phải đảm bảo hoàn thành các thủ tục cần thiết do BTC đưa ra. Trong trường hợp ngược lại, BTC có quyền từ chối yêu cầu của Đội tuyển.',
          'Trường hợp các bạn “đánh thuê(1)” cho các bạn khác với mọi lý do chúng mình sẽ không cho bạn tham gia các trận đấu còn lại của giải đấu và không cho tham gia các giải đấu còn lại của Dong Chuyen Nghiep với mọi hình thức',
        ]}
      />
      <Section
        title="V. Địa điểm thi đấu"
        content={
          <>
            <p>
              Tất cả các trận đấu thuộc khuôn khổ{' '}
              <strong> GIẢI LIÊN QUÂN MOBILE GIỮA CÁC LỚP TRƯỜNG THPT PHÚ NHUẬN: SEASON 2</strong>{' '}
              sẽ được tổ chức theo hình thức online.
            </p>
          </>
        }
      />
      <Section
        title="VI. Đầu Hàng"
        content="Không được đầu hàng. Nếu còn trận đấu, sẽ bị xử thua thêm một trận nữa. Nếu không, sẽ bị đưa vào danh sách đen cho giải tiếp theo."
      />

      <Section
        title="VII. Bỏ Giải"
        content=" DCN không bắt buộc các bạn đăng kí giải đấu và đóng lệ phí tham gia với mọi hình thức nhưng các bạn vui lòng CÓ TÂM hơn với lượt tham gia của mình qua việc không bỏ giải. Trường hợp bỏ giải đấu vô điều kiện chúng mình phải thu 30k/ đội, nếu các bạn không đóng tiền chúng mình bắt buộc phải giữ thể diện của DCN bằng việc cấm các bạn trong đội hình đó tham gia các giải đấu game thuộc khuôn khổ DCN."
      />

      <Section
        title="VIII. VẤN ĐỀ KHAI BÁO ĐỘI HÌNH TRƯỚC TRẬN, THAY NGƯỜI, VÀ THAY ĐỔI VỊ TRÍ TRONG TRẬN"
        content="Mỗi đội có thể tiến hành thay đổi Tuyển thủ sau các ván đấu."
        rules={[
          'Các đội thi đấu vui lòng thông báo đội hình trước 12h trưa ngày thi đấu. Các bạn phải khai báo tên người chơi và dự bị nếu có.',
          'Đội tuyển chỉ được phép thay tối đa một Tuyển thủ trong mỗi ván đấu. Tuy nhiên, một Đội tuyển chỉ có thể được phép thay đổi TỐI ĐA là 05 tuyển thủ trong trận đấu BO5 và BO7.',
          'Thay đổi Tuyển thủ trong khi thi đấu chỉ có hiệu lực ở trong các lựa chọn sau: Trận BO3, BO5, BO7. Sau ván 1, Đội tuyển có thể tiến hành thay đổi Tuyển thủ dự bị. ',
          'Trách nhiệm của đội tuyển trong việc thay người giữa các ván đấu Đội tuyển có trách nhiệm thông báo về yêu cầu thay đổi Tuyển thủ cho BTC và chỉ được coi là thay đổi hợp lệ nếu được BTC chấp thuận chậm nhất 3 phút ngay sau khi nhà chính của ván đấu liền trước đó bị phá hủy. Nếu chậm trễ trong việc thông báo, BTC có quyền không chấp nhận yêu cầu thay đổi này.',
        ]}
      />

      <Section
        title="IX. Vấn Đề Pick’em Challenge"
        content={
          <>
            - Mỗi một tài khoản chỉ có thể dự đoán <strong> 1 LẦN </strong> duy nhất. Trước khi trận
            đấu hay vòng đấu bắt đầu các bạn có thể thay đổi lựa chọn không giới hạn. Pick'em sẽ
            khóa câu trả lời trước vòng đấu hoặc trận đấu 30 phút. Nếu các bạn sử dụng lỗi (Bug) để
            thay đổi lựa chọn sau khi đã khóa câu trả lời thì sẽ <strong>CẤM</strong> người chơi đó
            chơi Pick'em trong tương lai.
            <br />- <strong className="uppercase">Nghiêm cấm </strong> dùng website Pick'em của Dong
            Chuyen Nghiep để thực hiện các hành vi{' '}
            <strong className="uppercase">cá độ/bán độ</strong>. Tùy mức độ vi phạm sẽ bị xử lý theo
            pháp luật.
          </>
        }
        rules={[
          'Đối với học sinh THPT Phú Nhuận: Báo cáo lên ban giám hiệu nhà trường.',
          'Gửi báo cáo cho cơ quan thẩm quyền nếu vi phạm ngoài trường THPT Phú Nhuận.',
        ]}
      />

      <Section
        title="X. Nháy đèn"
        content={
          <>
            Chỉ cần làm 1 lần thì tự động xử thua toàn bộ trận đấu. Còn nếu biến về bị lag thì tụi
            mình sẽ bỏ qua (vui lòng gửi bằng chứng ping cao hoặc packet loss).
          </>
        }
      />

      <Conclusion
        content="Cảm ơn các bạn đã đọc luật và chúc các bạn có một mùa giải thành công!! Graaaaa"
        note="xét vào trường hợp account không thuộc quyền sở hữu của người sử dụng chỉ với mục đích đủ người hoặc vì lý do cá nhân nhằm tăng khả năng chiến thắng."
      />
    </div>
  );
};

const Section = ({ title, content, rules, smallerrules }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-secondary mb-3 uppercase">{title}</h2>
      <div className="text-[17px] text-base-content mb-2 font-semibold">{content}</div>
      {rules && (
        <ul className="list-disc pl-6">
          {rules.map((rule, index) => (
            <li key={index} className="mb-1 font-semibold text-base-content text-[17px]">
              {rule}
            </li>
          ))}
        </ul>
      )}
      {smallerrules && (
        <ul className="list-disc pl-12">
          {smallerrules.map((rule, index) => (
            <li key={index} className="mb-1 font-semibold text-base-content text-[17px]">
              {rule}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Conclusion = ({ content, note }) => {
  return (
    <div className="mt-10 text-center">
      <h2 className="text-2xl font-semibold text-secondary">Kết Luận</h2>
      <p className="text-lg text-base-content font-semibold mt-4">{content}</p>
      <div className="mt-10 text-left">
        <h3 className="text-xl font-semibold text-error italic">Ghi Chú</h3>
        <p className="text-[16px] text-base-content mt-2 font-semibold">(1) {note}</p>
      </div>
    </div>
  );
};

export default RuleBook;
