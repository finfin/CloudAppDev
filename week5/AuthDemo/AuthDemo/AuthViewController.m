//
//  AuthViewController.m
//  AuthDemo
//
//  Created by chronoer on 13/4/30.
//  Copyright (c) 2013年 Zencher Co., Ltd. All rights reserved.
//

#import "AuthViewController.h"
#import "AFNetworking.h"


@interface AuthViewController ()
@property (weak, nonatomic) IBOutlet UIScrollView *editingScrollView;
@property (weak, nonatomic) IBOutlet UITextField *accountField;
@property (weak, nonatomic) IBOutlet UITextField *emailField;
@property (weak, nonatomic) IBOutlet UITextField *passwordField;
@property (weak, nonatomic) IBOutlet UITextField *repasswordField;
@property (weak, nonatomic) IBOutlet UILabel *statusLabel;

@end

@implementation AuthViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    CGRect originalRect = self.editingScrollView.frame;
    self.editingScrollView.contentSize = originalRect.size;
    [[NSNotificationCenter defaultCenter] addObserverForName:UIKeyboardDidShowNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification *note) {
        //        NSLog(@"%@",note);
        
        
        CGRect endRect = [note.userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
        CGRect originalRect = self.editingScrollView.frame;
        self.editingScrollView.frame = CGRectMake(originalRect.origin.x, originalRect.origin.y, originalRect.size.width, endRect.origin.y - originalRect.origin.y);
    }];
    
    [[NSNotificationCenter defaultCenter] addObserverForName:UIKeyboardWillHideNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification *note) {
        CGRect endRect = [note.userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
        CGRect originalRect = self.editingScrollView.frame;
        self.editingScrollView.frame = CGRectMake(originalRect.origin.x, originalRect.origin.y, originalRect.size.width, endRect.origin.y - originalRect.origin.y);
    }];

	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void) remoteSignUp{
    NSLog(@"sign up");
    [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
    NSURL *url = [NSURL URLWithString:[AWSServer stringByAppendingString:@"/register"]];
    NSMutableURLRequest * postRequest = [NSMutableURLRequest requestWithURL:url];
    postRequest.HTTPMethod = @"POST";
    NSDictionary * bodyDict = @{@"name": self.accountField.text, @"password": self.passwordField.text, @"email": self.emailField.text};
    NSString * paraString = [NSString stringWithFormat:@"name=%@&password=%@&email=%@",bodyDict[@"name"], bodyDict[@"password"], bodyDict[@"email"]];
    postRequest.HTTPBody = [paraString dataUsingEncoding:NSUTF8StringEncoding];
    
    [NSURLConnection sendAsynchronousRequest:postRequest queue:[NSOperationQueue new] completionHandler:^(NSURLResponse * response, NSData * data, NSError * error) {
        [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
        if (error) {
            NSLog(@"%@", error);
        }else{
            NSHTTPURLResponse * httpResponse = (NSHTTPURLResponse *)response;
            NSLog(@"%@", httpResponse.allHeaderFields);
            NSLog(@"%d", httpResponse.statusCode);
            
            dispatch_async(dispatch_get_main_queue(), ^{
                switch (httpResponse.statusCode)
                {
                    case 200:
                         [self.SignFinishDelegate signfinish:bodyDict];
                        break;
                    case 400:
                        self.statusLabel.text = [NSString stringWithFormat:@"%@",@"duplicate username or email"];
                        break;
                    default:
                        break;
                }
                
               
            });
            
        }
        
    }];
}
#pragma mark Text Field delegate

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    if (textField.tag == 10) {
        [textField resignFirstResponder];
        [self.passwordField becomeFirstResponder];
        CGRect visiblePass = self.passwordField.frame;
        [self.editingScrollView scrollRectToVisible:CGRectMake(visiblePass.origin.x, visiblePass.origin.y+30, visiblePass.size.width, visiblePass.size.height) animated:YES];
    }else if(textField.tag == 11){
        [textField resignFirstResponder];
        [self.repasswordField becomeFirstResponder];
        CGRect visiblePass = self.repasswordField.frame;
        [self.editingScrollView scrollRectToVisible:CGRectMake(visiblePass.origin.x, visiblePass.origin.y+30, visiblePass.size.width, visiblePass.size.height) animated:YES];
    }
    else{
        [textField resignFirstResponder];
        
        if ([self.passwordField.text isEqualToString:self.repasswordField.text])
        {
            [self remoteSignUp];
        }
        else
        {
            self.statusLabel.text = @"error password";
        }
    }
    return YES;
}
- (IBAction)signup:(id)sender {
    if ([self.passwordField.text isEqualToString:self.repasswordField.text])
    {
        [self remoteSignUp];
    }
    else
    {
        self.statusLabel.text = @"error password";
    }
}

@end
