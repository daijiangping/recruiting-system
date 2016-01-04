package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.bean.UserDetail;

public interface UserMapper {

    public int insertUser(User user);

    public User getUserById(int id);

    public User getUserByEmail(String email);

    public User getUserByMobilePhone(String mobilePhone);

    public User getUserByEmailAndPassWord(User user);

    public UserDetail getUserDetailById(int userId);
}
