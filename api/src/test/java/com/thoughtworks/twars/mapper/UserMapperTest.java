package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.bean.UserDetail;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class UserMapperTest extends TestBase {

    private UserMapper userMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        userMapper = session.getMapper(UserMapper.class);
    }

    @After
    public void tearDown() throws Exception {
        super.tearDown();
    }

    @Test
    public void should_return_user_by_id() throws Exception {
        User user = userMapper.getUserById(1);
        assertThat(user.getMobilePhone(), is("12345678901"));
    }

    @Test
    public void should_return_user_by_email() throws Exception {
        User user = userMapper.getUserByEmail("test@163.com");
        assertThat(user.getMobilePhone(), is("12345678901"));
    }

    @Test
    public void should_return_user_by_mobile_phone() throws Exception {
        User user = userMapper.getUserByMobilePhone("12345678901");
        assertThat(user.getEmail(), is("test@163.com"));
    }

    @Test
    public void should_return_user_by_email_and_password() throws Exception {
        User returnUser = userMapper.getUserById(1);
        User user = userMapper.getUserByEmailAndPassWord(returnUser);
        assertThat(user.getMobilePhone(), is("12345678901"));
    }

    @Test
    public void should_add_user() throws Exception {
        User user = new User();

        user.setEmail("test3@163.com");
        user.setMobilePhone("123456789012");
        user.setPassword("18928392811");

        userMapper.insertUser(user);

        assertThat(user.getId(), is(6));
    }

    @Test
    public void should_return_user_detail_by_id() throws Exception {
        UserDetail detail = userMapper.getUserDetailById(1);

        assertThat(detail.getUserId(), is(1));
        assertThat(detail.getSchool(), is("思沃学院"));
        assertThat(detail.getName(), is("测试一"));
        assertThat(detail.getMajor(), is("计算机"));
        assertThat(detail.getDegree(), is("本科"));
        assertThat(detail.getGender(), is("男"));
    }
}
