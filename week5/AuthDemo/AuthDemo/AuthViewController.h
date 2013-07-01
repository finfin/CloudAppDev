//
//  AuthViewController.h
//  AuthDemo
//
//  Created by chronoer on 13/4/30.
//  Copyright (c) 2013年 Zencher Co., Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>
@protocol SignDelegate <NSObject>

- (void)signfinish:(NSDictionary *)dicWitInfo;

@end

@interface AuthViewController : UIViewController
@property (nonatomic, weak) id<SignDelegate> SignFinishDelegate;

@end
