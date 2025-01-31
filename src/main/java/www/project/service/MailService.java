package www.project.service;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import www.project.repository.UserMapper;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
@Getter
public class MailService{
    private final JavaMailSender sender;
    private static final String fromEmail = "qansd38@gmail.com";
    private final int randomNumber = createNumber();
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public void sendMail(String email) {
        MimeMessage message = sender.createMimeMessage();
        try{
            message.setFrom(new InternetAddress(fromEmail,"project"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("[Movie Picnic] 요청하신 이메일 인증입니다.");
            String text = "<html><body>" +
                    "<h2>Movie Picnic 이메일 인증</h2>" +
                    "<p>아래의 번호로 인증을 완료해주세요.</p>" +
                    "<h1>"+randomNumber+"</h1>" +
                    "<p>감사합니다.</p>" +
                    "</body></html>";
            message.setContent(text, "text/html;charset=utf-8");

            sender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e){
            e.printStackTrace();
        }
    }

    private int createNumber() {return (int)(Math.random()*90000)+10000;}
    public Boolean verificationEmail(int number) { return randomNumber==number; }

    public void sendNewPw(String email) {
        MimeMessage message = sender.createMimeMessage();
        try{
            String tmpPw = getTempPassword();
            message.setFrom(new InternetAddress(fromEmail,"project"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("[Movie Picnic] 임시 비밀번호 발급 안내입니다.");
            String text = "<html><body>" +
                    "<h2>Movie Picnic 임시 비밀번호 발급</h2>" +
                    "<p>아래의 비밀번호로 다시 로그인 해주세요.</p>" +
                    "<h1>"+tmpPw+"</h1>" +
                    "<p>홈페이지 접속 후 비밀번호를 변경해주세요.</p>" +
                    "</body></html>";
            message.setContent(text, "text/html;charset=utf-8");

            sender.send(message);

            String newPw = passwordEncoder.encode(tmpPw);
            userMapper.updatePw(email,newPw);
        } catch (MessagingException | UnsupportedEncodingException e){
            e.printStackTrace();
        }
    }

    public String getTempPassword(){
        char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };

        String tmppw = "";

        int idx = 0;
        for (int i = 0; i < 10; i++) {
            idx = (int) (charSet.length * Math.random());
            tmppw += charSet[idx];
        }
        return tmppw;
    }
}
