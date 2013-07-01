//
//  LoginViewController.h
//  AuthDemo
//
//  Created by chronoer on 13/4/30.
//  Copyright (c) 2013年 Zencher Co., Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol LoginEndDelegate <NSObject>

- (void)loginfinish;

@end

@interface LoginViewController : UIViewController
@property (nonatomic, weak) id<LoginEndDelegate> loginFinishDelegate;

@end
